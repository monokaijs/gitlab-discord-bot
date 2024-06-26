import { Avatar, Button, Flex, Modal, Typography, message } from "antd";
import Link from "antd/es/typography/Link";
import React, { useState } from "react";
import { DiscordOutlined } from "@ant-design/icons";
import apiService from "../../lib/services/api.service";
import useApi from "../../lib/hooks/useApi";

interface Props {
  open: boolean;
  onClose: () => void;
  channel: any;
  onFinish: () => void;
}

export default function BindingOverview(props: Props) {
  const { open, onClose, channel, onFinish } = props;
  const gitlab = channel?.binding?.gitlab;

  const [doUnbindProject, { loading }] = useApi(
    apiService.unbindGitlabProjects
  );

  const handleUnbindProjectToChannel = (projectId) => {
    doUnbindProject({ projectId })
      .then(() => {
        onFinish && onFinish();
        onClose();
      })
      .catch((res) => {
        message.error(res?.message ?? "Failed!");
      });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onClose={onClose}
      closeIcon={false}
      width={600}
      footer={false}
    >
      <Flex about="center" gap={8}>
        <Avatar src={gitlab?.avatar_url}>
          {gitlab?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {gitlab?.name}
        </Typography.Title>
      </Flex>
      <Flex
        style={{
          flexDirection: "column",
          marginTop: 12,
          gap: 5,
        }}
      >
        <Typography.Text>
          Owner:{" "}
          <Link target="_blank" href={gitlab?.owner?.web_url}>
            {gitlab?.owner?.name}
          </Link>
        </Typography.Text>
        <Typography.Text>
          Repository link:{" "}
          <Link target="_blank" href={gitlab?.web_url}>
            {gitlab?.web_url}
          </Link>
        </Typography.Text>
        <div style={{ marginTop: 16 }}>
          <Button
            danger
            icon={<DiscordOutlined />}
            loading={loading}
            onClick={() => {
              handleUnbindProjectToChannel(gitlab?.id);
            }}
            size="small"
          >
            Unbind from {channel?.binding?.channel?.name}
          </Button>
        </div>
      </Flex>
    </Modal>
  );
}
