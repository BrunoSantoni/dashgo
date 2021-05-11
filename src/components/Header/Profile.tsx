import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

type ProfileProps = {
  showProfileInfo?: boolean;
};

export function Profile({ showProfileInfo = true }: ProfileProps) {
  return(
    <Flex align="center">
      {
        showProfileInfo && (
          <Box mr="4" textAlign="right">
            <Text>Bruno Santoni</Text>
            <Text color="gray.300" fontSize="small">bsantoni98@gmail.com</Text>
          </Box>
        )
      }

      <Avatar size="md" name="Bruno Santoni" src="https://github.com/BrunoSantoni.png" />
    </Flex>
  );
}