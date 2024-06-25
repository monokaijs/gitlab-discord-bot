import {Button, Card, Collapse, ConfigProvider, List, Typography} from "antd";
import useApi from "./lib/hooks/useApi";
import apiService from "./lib/services/api.service";
import React, {useEffect} from "react";
import {Channel, NonThreadGuildBasedChannel} from "discord.js";

export default function App() {
  const [getChannels, {data: channels}] = useApi<NonThreadGuildBasedChannel[]>(apiService.getChannels, apiService, []);

  useEffect(() => {
    getChannels().then(() => {
    });
  }, []);

  return <ConfigProvider theme={{
    token: {
      fontFamily: 'Lexend Deca'
    },
  }}>
    <div style={{padding: 16}}>
      <Typography.Title level={4}>
        Channels
      </Typography.Title>
      <Collapse
        items={channels.filter(item => !item.parentId).map(channel => ({
          key: channel.id,
          label: channel.name,
          style: {padding: 0},
          children: <List
            dataSource={channels.filter(item => item.parentId === channel.id)}
            renderItem={(item) => {
              return <List.Item>
                <List.Item.Meta
                  title={item.name}
                />
                <Button size={'small'}>Bind Project</Button>
              </List.Item>
            }}
          />
        }))}
        defaultActiveKey={['1']}
      />
    </div>
  </ConfigProvider>
}
