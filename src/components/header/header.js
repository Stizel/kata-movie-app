import { Input, Tabs } from 'antd'
import React, { Component } from 'react'
import './header.css'
import PropTypes from 'prop-types'

export default class Header extends Component {
  constructor(props) {
    super(props)
    const { inputHandler } = this.props

    this.state = {
      label: '',
    }

    this.inputRef = React.createRef()

    this.onLabelChange = (e) => {
      this.setState({ label: e.target.value })
      inputHandler(e.target.value)
    }
  }

  componentDidMount() {
    const { selectedTab } = this.props
    if (selectedTab === 'search') {
      this.inputRef.current.focus()
    }
  }

  render() {
    const { selectedTab, tabHandler } = this.props
    const { label } = this.state
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
                  onChange={this.onLabelChange}
                  value={label}
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
