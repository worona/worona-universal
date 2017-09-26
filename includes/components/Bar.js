import React from 'react'
import { observable } from 'mobx';

const map = observable.map({ key: "value"});
map.set("key", "new value");

export default () =>
  <div>
    <span>Bar -- loaded!!</span>
  </div>
