import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swipe from '../extensions/Swipe';
import { routeChangeRequested } from '../extensions/router/actions';
import fakePost from './fakePost';

const list = [
  '000',
  '001',
  '002',
  '003',
  '004',
  '005',
  '006',
  '007',
  '008',
  '009',
  '010',
  '011',
  '012',
  '013',
  '014',
];
const listType = 'posts';

const currentSwipe = {
  list,
  active: 0,
};

const slideColors = [
  'indianred',
  'darkseagreen',
  'cadetblue',
  'salmon',
  'lightyellow',
  'indianred',
  'darkseagreen',
  'cadetblue',
  'salmon',
  'lightyellow',
  'indianred',
  'darkseagreen',
  'cadetblue',
  'salmon',
  'lightyellow',
];

const Slide = ({ index, length }) => (
  <div style={{ fontWeight: 'bold', fontSize: '20px', backgroundColor: slideColors[index] }}>
    {Array(length)
      .fill(0)
      .map((e, num) => (
        <p
          style={{
            margin: 0,
            padding: '10px 0',
            borderTop: '1px solid black',
            textAlign: 'center',
          }}
        >
          {num}
        </p>
      ))}
  </div>
);

class Slider extends Component {
  constructor(props) {
    super(props);

    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  handleChangeIndex({ index, fromProps }) {
    console.log('handleChangeIndex', index, fromProps);
    if (!fromProps) {
      // Update active in current list
      currentSwipe.active = index;

      // dispatch a route change
      console.log('dispatch a route change');
      const currentType = listType;
      const currentId = currentSwipe.list[currentSwipe.active];
      this.props.changeRoute({ currentType, currentId });
    } else {
      // do nothing
      console.log('do nothing');
    }
  }

  render() {
    const { currentId, slides } = this.props;
    return (
      <Swipe index={currentSwipe.list.indexOf(currentId)} onChangeIndex={this.handleChangeIndex}>
        {Array(slides)
          .fill(0)
          /* .map((e, i) => <Slide index={i} length={30} />)} */
          .map((e, i) => <div index={i} dangerouslySetInnerHTML={{ __html: fakePost }} />)}
      </Swipe>
    );
  }
}

Slider.propTypes = {
  slides: PropTypes.number.isRequired,
  // currentType: PropTypes.string.isRequired,
  currentId: PropTypes.string.isRequired,
  changeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentType: state.router.currentType,
  currentId: state.router.currentId,
});

const mapDispatchToProps = dispatch => ({
  changeRoute: typeAndId => dispatch(routeChangeRequested(typeAndId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
