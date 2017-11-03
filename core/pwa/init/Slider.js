/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { times } from 'lodash';
import LazyLoad from 'react-lazyload';
import Waypoint from 'react-waypoint';
import Swipe from '../extensions/Swipe';
import * as selectors from '../extensions/router/selectors';
import * as actions from '../extensions/router/actions';

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

const Slide = ({ index, length }) => {
  const slideStyle = { fontWeight: 'bold', fontSize: '20px', backgroundColor: slideColors[index] };
  const numberStyle = {
    margin: 0,
    padding: '10px 0',
    borderTop: '1px solid black',
    textAlign: 'center',
  };

  return (
    <div style={slideStyle}>
      {[
        times(length, i => (i === 20
          ? <Waypoint
              key={`${index}_${i}`}
              onEnter={() => console.log(`enter waypoint ${index}`)}
              onLeave={() => console.log(`leave waypoint ${index}`)}
              scrollableAncestor={'window'}
              fireOnRapidScroll={false}
            >
              <div style={{ border: 'solid 2px yellow'}}>
                <p key={`p${i}`} style={numberStyle}>{i}</p>
              </div>
            </Waypoint>
          : <p key={`p${i}`} style={numberStyle}>{i}</p>
        )),
        <LazyLoad
          offset={-100}
          unmountIfInvisible
          placeholder={<div style={numberStyle}>{'not loaded yet'}</div>}
        >
          <div style={numberStyle}>{'LAZY LOADED'}</div>
        </LazyLoad>,
      ]}
    </div>
  );
};

Slide.propTypes = {
  index: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
};

class Slider extends Component {
  constructor(props) {
    super(props);

    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  handleChangeIndex({ index, fromProps }) {
    if (!fromProps) {
      // Update active in current list
      currentSwipe.active = index;
      // dispatch a route change
      const currentType = listType;
      const currentId = currentSwipe.list[currentSwipe.active];
      this.props.changeRoute({ currentType, currentId });
    }
  }

  render() {
    const { id, count } = this.props;
    const slideIds = times(count, i => i);

    // Emulating scroll in first slide
    const twoFirstSlides = slideIds.splice(0,2);
    slideIds.unshift(twoFirstSlides);

    console.log(slideIds);

    return (
      <Swipe index={currentSwipe.list.indexOf(id)} onChangeIndex={this.handleChangeIndex}>
        {slideIds.map(i => {
          if (i instanceof Array) {
            return <div>{i.map(j => <Slide key={`slide-${j}`} index={j} length={30} />)}</div>;
          }
          return <Slide key={`slide-${i}`} index={i} length={30 + (30 * (i % 2))} />;
        })}
      </Swipe>
    );
  }
}

Slider.propTypes = {
  count: PropTypes.number.isRequired,
  // type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  changeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  type: selectors.getType(state),
  id: selectors.getId(state),
});

const mapDispatchToProps = dispatch => ({
  changeRoute: typeAndId => dispatch(actions.routeChangeRequested(typeAndId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
