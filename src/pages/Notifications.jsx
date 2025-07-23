import { Box, Heading } from "@chakra-ui/react";
import NotificationsList from "@/components/ui/notifications/NotificationsList";
import NotificationHeader from "@/components/ui/notifications/NotificationHeader";

const Notifications = () => {
  return (
    <Box >
      <NotificationHeader />
      <NotificationsList />
    </Box>
  );
};

export default Notifications;
