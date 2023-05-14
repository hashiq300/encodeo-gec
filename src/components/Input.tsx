import { TextInput, type TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconLoaderQuarter } from '@tabler/icons-react';
import { useState } from 'react';

export function Input(props: TextInputProps) {
    const theme = useMantineTheme();
    const [good] = useState(false);
    return (
        <TextInput
            radius="sm"
            size="md"
            rightSection={
                <ActionIcon size={32} radius="sm" className='blue-background' color={theme.primaryColor} disabled={good} variant="filled">
                    {good ? (
                        <IconLoaderQuarter className="loader" size="1.1rem" stroke={1.5} />
                    ) : (
                        <IconArrowRight size="1.1rem" stroke={1.5} />
                    )}
                </ActionIcon>
            }
            placeholder="Enter the code"
            rightSectionWidth={42}
            {...props}
        />
    );
}