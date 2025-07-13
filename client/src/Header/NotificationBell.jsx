import React, { useEffect } from "react";
import {
  Popover,
  OverlayTrigger,
  Badge,
  ListGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../store/notificationSlice"; // Thunk'ı import et

const BellIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
    <path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 22.0001 12 22C11.6496 22.0001 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
  </svg>
);

function NotificationBell() {
  const dispatch = useDispatch();
  const { items: notifications, status } = useSelector(
    (state) => state.notifications
  );

  // Component yüklendiğinde bildirimleri çek
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications());
    }
  }, [status, dispatch]);

  // Henüz 'read' alanı modelinizde olmayabilir, bu mantığı şimdilik basitleştirelim.
  // Gerçekte 'read' durumunu da veritabanında tutmalısınız.
  const unreadCount = notifications.filter((n) => !n.read).length;

  const popoverContent = (
    <Popover
      id="popover-notifications"
      style={{
        minWidth: "300px",
        border: "none",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Popover.Header as="h3">Bildirimler</Popover.Header>
      <Popover.Body
        style={{ padding: 0, maxHeight: "400px", overflowY: "auto" }}
      >
        {status === "loading" && (
          <div className="text-center p-3">
            <Spinner animation="border" />
          </div>
        )}
        {status === "succeeded" && (
          <ListGroup variant="flush">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListGroup.Item key={notification.id}>
                  {notification.body || notification.text}{" "}
                  {/* Modelinize göre alan adını ayarlayın */}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Yeni bildirim yok.</ListGroup.Item>
            )}
          </ListGroup>
        )}
        {status === "failed" && (
          <div className="text-center p-3 text-danger">
            Bildirimler yüklenemedi.
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-end"
      overlay={popoverContent}
      rootClose
    >
      <Button
        variant="light"
        className="rounded-circle p-2"
        style={{ lineHeight: 0, position: "relative" }}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <Badge
            pill
            bg="danger"
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              fontSize: "0.6em",
            }}
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    </OverlayTrigger>
  );
}

export default NotificationBell;
