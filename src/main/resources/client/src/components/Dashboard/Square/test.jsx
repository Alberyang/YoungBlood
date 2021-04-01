import React from "react";
import Collapse from "@material-ui/core/Collapse";
import Emoji from "./Emoji";
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  handle = () => {
    console.log(this.state.active);
    this.setState({ active: !this.state.active });
  };

  render() {
    return (
      <div>
        <button onClick={this.handle}></button>
        <Collapse in={this.state.active}>
          <Emoji />
        </Collapse>
      </div>
    );
  }
}

export default Posts;
