import { DiscordOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Input,
  Modal,
  Spin,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import useApi from "../../lib/hooks/useApi";
import useDebounce from "../../lib/hooks/useDebounce";
import apiService from "../../lib/services/api.service";

interface Props {
  open: boolean;
  onClose: () => void;
  channel: any;
  onFinish?: () => void;
}

export default function GitlabProjects(props: Props) {
  const { open, onClose, channel, onFinish } = props;
  const [getProjects, res] = useApi<any[]>(apiService.getGitlabProjects);
  const [query, setQuery] = useState("");
  const queryDebounce = useDebounce(query);

  useEffect(() => {
    getProjects(queryDebounce);
  }, [queryDebounce, open]);

  const [doBindProject] = useApi(apiService.bindGitlabProjects);
  const [loading, setLoading] = useState("");

  const handleBindProjectToChannel = (project: any) => {
    setLoading(project.id);
    doBindProject({ projectId: project.id, channel })
      .then(() => {
        onFinish && onFinish();
        getProjects(queryDebounce);
        onClose();
      })
      .catch((res) => {
        message.error(res?.message ?? "Failed!");
      })
      .finally(() => {
        setLoading("");
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
      <Flex justify="space-between" gap={60} align="center">
        <Typography.Title style={{ margin: 0 }} level={4}>
          Gitlab Projects
        </Typography.Title>
        <div style={{ flex: 1 }}>
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            disabled={res.loading}
            suffix={<SearchOutlined />}
            placeholder="Search project..."
          />
        </div>
      </Flex>
      <Flex
        style={{
          flexDirection: "column",
          maxHeight: 500,
          overflowY: "scroll",
          margin: "16px 0",
          gap: 16,
          paddingRight: 4,
          marginRight: -8,
        }}
        id="gitlab-projects"
      >
        {res.loading ? (
          <Flex justify="center" style={{ padding: "40px 0" }}>
            <Spin />
          </Flex>
        ) : (
          res?.data?.map((item, i) => {
            return (
              <Card key={i}>
                <Flex align="center" justify="space-between">
                  <Flex style={{ flexDirection: "column" }}>
                    <Typography.Text style={{ margin: 0, fontSize: 16 }}>
                      {item.name}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ margin: 0 }}>
                      {item?.path_with_namespace}
                    </Typography.Text>
                  </Flex>
                  {item.binding ? (
                    <Button
                      size="small"
                      type="primary"
                      icon={<DiscordOutlined />}
                    >
                      {item?.binding?.channel?.name}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => {
                        handleBindProjectToChannel(item);
                      }}
                      loading={loading === item?.id}
                    >
                      Bind Project
                    </Button>
                  )}
                </Flex>
              </Card>
            );
          })
        )}
      </Flex>
    </Modal>
  );
}
