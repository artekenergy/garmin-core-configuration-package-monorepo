# Updated Channel Names from EmpirBus

## Channels with Updated Names

The following channels now have the `core-channel-X` naming format in the EmpirBus project:

| Channel | Old Name | New Name | Label in Config |
|---------|----------|----------|-----------------|
| 11 | Channel 11 | core-channel-11 | Core 11 |
| 12 | Channel 12 | core-channel-12 | Core 12 |
| 13 | out-channel-13 | core-channel-13 | Core 13 |
| 17 | out-channel-17 | core-channel-17 | Core 17 |
| 18 | out-channel-18 | core-channel-18 | Core 18 |
| 19 | out-channel-19 | core-channel-19 | Core 19 |
| 20 | out-channel-20 | core-channel-20 | Core 20 |
| 21 | out-channel-21 | core-channel-21 | Core 21 |
| 25 | out-channel-25 | core-channel-25 | Core 25 |
| 26 | out-channel-26 | core-channel-26 | Core 26 |
| 27 | out-channel-27 | core-channel-27 | Core 27 |
| 28 | out-channel-28 | core-channel-28 | Core 28 |
| 29 | out-channel-29 | core-channel-29 | Core 29 |

## Channels Still Using Old Names

These channels still have generic names and could be updated:

| Channel | Current Name | Suggested New Name |
|---------|--------------|-------------------|
| 1 | Channel 1 | core-channel-1 |
| 2 | Channel 2 | core-channel-2 |
| 3 | Channel 3 | core-channel-3 |
| 4 | Channel 4 | core-channel-4 |
| 5 | Channel 5 | core-channel-5 |
| 6 | Channel 6 | core-channel-6 |
| 7 | Channel 7 | core-channel-7 |
| 8 | Channel 8 | core-channel-8 |
| 9 | Channel 9 | core-channel-9 |
| 10 | Channel 10 | core-channel-10 |

## How to Update Remaining Channels

In your EmpirBus Studio project:

1. Open the project
2. Find each channel in the channel list
3. Change the name from "Channel X" to "core-channel-X"
4. Save the project
5. Re-run the extraction script:
   ```bash
   python3 scripts/extract-empirbus-channels.py
   ```

## Current Configuration Status

✅ Channels 11-29: Using consistent naming
⏸️ Channels 1-10: Still need naming update

Once all channels are updated to the `core-channel-X` format, your hardware configuration will have consistent, predictable labels that align with your HMI application naming convention.
