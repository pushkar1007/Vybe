import { Box } from "@chakra-ui/react";
import NotificationsList from "@/components/ui/notifications/NotificationsList";
import PageHeader from "@/components/common/PageHeader";

const Notifications = () => {
  return (
    <Box >
      <PageHeader page="Notifications" />
      <NotificationsList />
    </Box>
  );
};

export default Notifications;
