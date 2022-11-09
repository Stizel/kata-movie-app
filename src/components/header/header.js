import { Input, Tabs } from 'antd'
import React, { Component } from 'react'
import './header.css'
import PropTypes from 'prop-types'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    const { selectedTab } = this.props
    if (selectedTab === 'search') {
      this.inputRef.current.focus()
    }
  }

  render() {
    const { inputHandler, selectedTab, tabHandler } = this.props
    return (
      <header className="header">
        <Tabs
          centered
          destroyInactiveTabPane
          activeKey={selectedTab}
          onChange={(key) => tabHandler(key)}
          items={[
            {
              label: 'Search',
              key: 'search',
              children: (
                <Input
                  ref={this.inputRef}
                  placeholder="Type to search..."
                  onChange={(e) => inputHandler(e.target.value)}
                />
              ),
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
}

Header.defaultProps = {
  selectedTab: 'search',
  inputHandler: () => {},
  tabHandler: () => {},
}
Header.propTypes = {
  selectedTab: PropTypes.string,
  inputHandler: PropTypes.func,
  tabHandler: PropTypes.func,
}
