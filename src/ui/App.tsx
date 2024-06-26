import { Button, Collapse, ConfigProvider, List, Typography } from "antd";
import { NonThreadGuildBasedChannel } from "discord.js";
import React, { useEffect, useState } from "react";
import GitlabProjects from "./components/GitlabProjects";
import useApi from "./lib/hooks/useApi";
import apiService from "./lib/services/api.service";
import BindingOverview from "./components/BindingOverview";
import { GitlabOutlined } from "@ant-design/icons";

export default function App() {
  const [getChannels, { data: channels }] = useApi<
    NonThreadGuildBasedChannel[]
  >(apiService.getChannels, apiService, []);

  const [bindModal, setBindModal] = useState(false);
  const [bindOverviewModal, setBindOverviewModal] = useState(false);

  const [channel, setChannel] = useState<
    NonThreadGuildBasedChannel | undefined
  >(undefined);

  useEffect(() => {
    getChannels().then(() => {});
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Lexend Deca",
        },
      }}
    >
      <div style={{ padding: 16 }}>
        <Typography.Title level={4}>Channels</Typography.Title>
        <Collapse
          items={channels
            .filter((item) => !item.parentId)
            .map((channel) => ({
              key: channel.id,
              label: channel.name,
              style: { padding: 0 },
              children: (
                <List
                  dataSource={channels.filter(
                    (item) => item.parentId === channel.id
                  )}
                  renderItem={(item: any) => {
                    return (
                      <List.Item>
                        <List.Item.Meta title={item.name} />
                        {item?.binding ? (
                          <Button
                            type="primary"
                            icon={<GitlabOutlined />}
                            onClick={() => {
                              setChannel(item);
                              setBindOverviewModal(true);
                            }}
                            size="small"
                          >
                            {item?.binding?.gitlab?.name}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setChannel(item);
                              setBindModal(true);
                            }}
                            size={"small"}
                          >
                            Bind Project
                          </Button>
                        )}
                      </List.Item>
                    );
                  }}
                />
              ),
            }))}
          defaultActiveKey={["1"]}
        />
        <GitlabProjects
          open={bindModal}
          onClose={() => {
            setChannel(undefined);
            setBindModal(false);
          }}
          channel={channel}
          onFinish={getChannels}
        />
        <BindingOverview
          open={bindOverviewModal}
          onClose={() => {
            setChannel(undefined);
            setBindOverviewModal(false);
          }}
          channel={channel}
          onFinish={getChannels}
        />
      </div>
    </ConfigProvider>
  );
}
