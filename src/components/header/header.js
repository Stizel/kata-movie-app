import { Input, Tabs } from 'antd'
import React from 'react'
import './header.css'

export default function Header({ inputHandler }) {
  return (
    <header className="header">
      <Tabs
        centered
        items={[
          {
            label: 'Search',
            key: 'search',
            children: <Input placeholder="Type to search..." onChange={(e) => inputHandler(e.target.value)} />,
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
