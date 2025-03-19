import { Flex, useBreakpointValue } from "@chakra-ui/react"

import Footer from "./components/Common/Footer"
import NavBar from "./components/Common/Navbar"
import SelectModel from "./components/Common/Select"

const App = () => {
	const display = useBreakpointValue({ base: "none", md: "flex" })
	return (
		<Flex display={display}
			flexDir={"column"}
			justify="center"
			position="sticky"
			color="bg.solid"
			align="center"
			bg="bg.muted"
			w="100%"
			h="full"
			top={0}
			p={4}>
			<NavBar />
			<Flex className="App" h="500px" color="bg.solid">Placeholder for the main app component</Flex>
			<SelectModel />
			<Footer />
		</Flex>
	)
}

export default App
