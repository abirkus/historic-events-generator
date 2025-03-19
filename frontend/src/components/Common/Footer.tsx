import { Flex, useBreakpointValue } from "@chakra-ui/react"

const Footer = () => {
    const display = useBreakpointValue({ base: "none", md: "flex" })

    return (
        <Flex
            display={display}
            justify="space-between"
            position="sticky"
            align="center"
            bg="bg.muted"
            w="100%"
            top={0}
            p={4}
            color="bg.solid"
        >
            Developed by Andre Birkus
        </Flex>
    )
}

export default Footer
