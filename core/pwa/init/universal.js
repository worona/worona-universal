import universal from 'react-universal-component';

const UniversalComponent = universal(props => import(`../../../packages/${props.name}/src/pwa`), {
  onLoad: (module, { isSync, isServer }, props, context) => {
    console.log('loaded!!!');
  }
});

export default UniversalComponent;
