"use client"

import {
    Portal,
    Select,
    Stack,
    createListCollection,
} from "@chakra-ui/react"

const SelectModel = () => {
    return (
        <Stack gap="5" width="320px">
            <Select.Root size={"lg"} collection={models}>
                <Select.HiddenSelect />
                <Select.Label>AI Model</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select AI model" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {models.items.map((model) => (
                                <Select.Item item={model} key={model.value}>
                                    {model.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

        </Stack>
    )
}

const models = createListCollection({
    items: [
        { label: "OpenAI", value: "gpt-4o-mini" },
        { label: "Gemini", value: "google" },
    ],
})

export default SelectModel
