import React from 'react';
import { inject } from 'mobx-react';

export default inject(stores => ({
  color: stores.color,
}))(({ color }) => (
  <div>
    <span>Bar -- loaded!! {color}</span>
  </div>
));
