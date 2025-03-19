import { Flex, Image, useBreakpointValue } from "@chakra-ui/react"
import Logo from "../../assets/react.svg"

function Navbar() {
	const display = useBreakpointValue({ base: "none", md: "flex" })

	return (
		<Flex
			display={display}
			justify="space-between"
			position="sticky"
			color="white"
			align="center"
			bg="bg.muted"
			w="100%"
			top={0}
			p={4}
		>
			<Image src={Logo} alt="Logo" maxW="3xs" p={2} />
		</Flex>
	)
}

export default Navbar
