#!/usr/bin/env python3
"""
Extract EmpirBus channel mappings from .ebp project file and signal-info.json
Creates a hardware configuration for schema.json

Signal Naming Convention (see docs/EMPIRBUS_SIGNAL_NAMING_CONVENTION.md):
- Channels with 'dcu-channel-X' signal → dimmer (intensity control)
- Channels with 'toggle-channel-X' or 'mom-channel-X' but NO dcu → toggle-button (on/off)
- Channels with 'special-function-X' → special-function (custom behavior)

The signal names in Unit 2 (MFD/WDU) determine the control type for HMI components.
"""

import json
import re
from pathlib import Path


def extract_channels_from_ebp(ebp_file):
    """Extract channel definitions from EmpirBus project file"""
    channels = []

    with open(ebp_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all output channels
    pattern = r'<channel number="(\d+)" name="([^"]*)" direction="Output"[^>]*outMainChannelSettingId="(\d+)"'
    matches = re.findall(pattern, content)

    for match in matches:
        ch_num, ch_name, setting_id = match
        channels.append({
            'number': int(ch_num),
            'name': ch_name,
            'settingId': int(setting_id)
        })

    return channels


def load_signal_info(signal_file):
    """Load signal information"""
    with open(signal_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def map_channels_to_signals(ebp_channels, signals):
    """Map EmpirBus channels to signal IDs and determine control types"""
    channel_map = {}

    # Build signal lookup by description
    signal_lookup = {}
    for sig in signals:
        desc = sig.get('description', '')
        signal_lookup[desc] = sig

    for ch in ebp_channels:
        ch_num = ch['number']
        ch_name = ch['name']

        # Look for corresponding signals
        toggle_desc = f"toggle-channel-{ch_num}-on-off"
        mom_desc = f"mom-channel-{ch_num}-on-off"
        dcu_desc = f"dcu-channel-{ch_num}"

        toggle_sig = signal_lookup.get(toggle_desc)
        mom_sig = signal_lookup.get(mom_desc)
        dcu_sig = signal_lookup.get(dcu_desc)

        # Determine control type based on signal naming convention
        # This is the key mapping logic - signal names determine control types:
        # - 'dcu-channel-X' signal present → dimmer (has intensity control)
        # - 'special-function-X' → special-function (custom behavior)
        # - 'toggle-channel-X' or 'mom-channel-X' only → toggle-button (on/off)
        #
        # settingId 48 = standard toggle/momentary
        # settingId 53 = special function
        control_type = "toggle-button"  # Default
        if ch['settingId'] == 53:
            control_type = "special-function"

        # If has DCU signal, it's a dimmer (most important check)
        if dcu_sig:
            control_type = "dimmer"
        # If only has momentary, it's a push button
        elif mom_sig and not toggle_sig:
            control_type = "push-button"

        channel_map[ch_num] = {
            'id': f"core-{ch_num:02d}",
            'source': 'core',
            'channel': ch_num,
            'control': control_type,
            'label': format_channel_name(ch_name, ch_num),
            'icon': get_icon_for_control(control_type),
            'signals': {
                'toggle': toggle_sig['signalId'] if toggle_sig else None,
                'momentary': mom_sig['signalId'] if mom_sig else None,
                'dimmer': dcu_sig['signalId'] if dcu_sig else None,
            },
            'originalName': ch_name
        }

    return channel_map


def format_channel_name(name, ch_num):
    """Convert EmpirBus channel name to user-friendly label"""
    # Remove common prefixes
    name = name.replace('out-channel-', '').replace('channel-', '')

    # If it's just a number, make it generic
    if name.isdigit() or name == f"Channel {ch_num}":
        return f"Output {ch_num}"

    # Convert hyphenated to title case
    name = name.replace('-', ' ').replace('_', ' ')
    name = ' '.join(word.capitalize() for word in name.split())

    return name


def get_icon_for_control(control_type):
    """Suggest an icon based on control type"""
    icons = {
        'toggle-button': '/icons/Light.svg',
        'push-button': '/icons/Power.svg',
        'dimmer': '/icons/Dimmer.svg',
        'special-function': '/icons/Settings.svg'
    }
    return icons.get(control_type, '/icons/Power.svg')


def generate_hardware_config(channel_map):
    """Generate hardware configuration for schema.json"""
    outputs = []

    for ch_num in sorted(channel_map.keys()):
        ch = channel_map[ch_num]
        outputs.append({
            'id': ch['id'],
            'source': ch['source'],
            'channel': ch['channel'],
            'control': ch['control'],
            'label': ch['label'],
            'icon': ch['icon']
        })

    hardware_config = {
        'systemType': 'core',
        'outputs': outputs
    }

    return hardware_config


def generate_component_examples(channel_map):
    """Generate example component definitions"""
    components = []

    for ch_num in sorted(list(channel_map.keys())[:5]):  # First 5 as examples
        ch = channel_map[ch_num]

        component = {
            'id': f"comp-{ch['id']}",
            'type': get_component_type(ch['control']),
            'label': ch['label'],
            'bindings': {}
        }

        # Add appropriate bindings
        if ch['control'] == 'dimmer':
            component['min'] = 0
            component['max'] = 100
            component['step'] = 5
            component['bindings']['intensity'] = {
                'type': 'empirbus',
                'channel': ch['id']
            }
        elif ch['control'] == 'push-button':
            component['action'] = 'momentary'
            component['bindings']['action'] = {
                'type': 'empirbus',
                'channel': ch['id']
            }
        else:  # toggle-button
            component['bindings']['state'] = {
                'type': 'empirbus',
                'channel': ch['id']
            }

        components.append(component)

    return components


def get_component_type(control_type):
    """Map control type to component type"""
    mapping = {
        'toggle-button': 'toggle',
        'push-button': 'button',
        'dimmer': 'dimmer',
        'special-function': 'button'
    }
    return mapping.get(control_type, 'toggle')


def print_report(channel_map):
    """Print a human-readable report"""
    print("=" * 100)
    print("EMPIRBUS CHANNEL MAPPING REPORT")
    print("=" * 100)
    print()

    # Group by control type
    by_type = {}
    for ch in channel_map.values():
        control = ch['control']
        if control not in by_type:
            by_type[control] = []
        by_type[control].append(ch)

    for control_type in sorted(by_type.keys()):
        channels = by_type[control_type]
        print(
            f"\n{control_type.upper().replace('-', ' ')}S ({len(channels)} channels)")
        print("-" * 100)
        print(f"{'ID':12s} {'Ch':>4s} {'Label':30s} {'Toggle':>8s} {'Mom':>8s} {'DCU':>8s} {'Original Name':30s}")
        print("-" * 100)

        for ch in sorted(channels, key=lambda x: x['channel']):
            toggle_id = ch['signals']['toggle'] or '-'
            mom_id = ch['signals']['momentary'] or '-'
            dcu_id = ch['signals']['dimmer'] or '-'

            print(f"{ch['id']:12s} {ch['channel']:4d} {ch['label']:30s} "
                  f"{str(toggle_id):>8s} {str(mom_id):>8s} {str(dcu_id):>8s} {ch['originalName']:30s}")

    print("\n" + "=" * 100)
    print(f"TOTAL CHANNELS: {len(channel_map)}")
    print("=" * 100)


def main():
    # File paths
    ebp_file = Path(__file__).parent.parent / 'core-v2_9-30-25_v1.ebp'
    signal_file = Path(__file__).parent.parent / 'web' / 'signal-info.json'
    output_dir = Path(__file__).parent.parent / 'configuration'

    print("Extracting channel mappings from EmpirBus project...")
    print(f"EBP File: {ebp_file}")
    print(f"Signal Info: {signal_file}")
    print()

    # Extract data
    ebp_channels = extract_channels_from_ebp(ebp_file)
    signals = load_signal_info(signal_file)

    print(f"Found {len(ebp_channels)} output channels in EmpirBus project")
    print(f"Found {len(signals)} signal definitions")
    print()

    # Map channels to signals
    channel_map = map_channels_to_signals(ebp_channels, signals)

    # Generate configurations
    hardware_config = generate_hardware_config(channel_map)
    component_examples = generate_component_examples(channel_map)

    # Print report
    print_report(channel_map)

    # Save hardware configuration
    output_dir.mkdir(exist_ok=True)
    hardware_file = output_dir / 'hardware-config.json'

    with open(hardware_file, 'w', encoding='utf-8') as f:
        json.dump(hardware_config, f, indent=2)

    print(f"\n✅ Hardware configuration saved to: {hardware_file}")

    # Save component examples
    examples_file = output_dir / 'component-examples.json'
    with open(examples_file, 'w', encoding='utf-8') as f:
        json.dump({
            'components': component_examples,
            'note': 'These are example components for the first 5 channels. Copy and modify as needed.'
        }, f, indent=2)
    print(f"✅ Component examples saved to: {examples_file}")

    # Save full mapping for reference
    mapping_file = output_dir / 'channel-mapping.json'
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump({
            'channels': {str(k): v for k, v in channel_map.items()},
            'metadata': {
                'totalChannels': len(channel_map),
                'source': str(ebp_file.name),
                'extractedAt': '2025-10-03'
            }
        }, f, indent=2)

    print(f"✅ Full channel mapping saved to: {mapping_file}")

    print("\n" + "=" * 100)
    print("NEXT STEPS:")
    print("=" * 100)
    print("1. Review hardware-config.json and update channel labels as needed")
    print("2. Copy the 'outputs' array to your schema.json hardware section")
    print("3. Use component-examples.json as a template for creating UI components")
    print("4. Reference channel-mapping.json for signal IDs and detailed information")
    print("=" * 100)


if __name__ == '__main__':
    main()
