import { Input, Tabs } from 'antd'
import React from 'react'
import './header.css'

export default function Header() {
  return (
    <header className="header">
      <Tabs
        centered
        items={[
          {
            label: 'Search',
            key: 'search',
            children: <Input />,
          },
          {
            label: 'Rated',
            key: 'rated',
          },
        ]}
      />
    </header>
  )
}
