import { Box, Heading } from "@chakra-ui/react";
import NotificationsList from "@/components/ui/notifications/NotificationsList";

const Notifications = () => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Notifications
      </Heading>
      <NotificationsList />
    </Box>
  );
};

export default Notifications;
