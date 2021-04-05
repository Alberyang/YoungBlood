import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Hero from '../Home/Hero';
import Functionalities from './Functionalities';
import Appbar from '../Navigation/Appbar';

export default function HomePage() {
  return (
    <Fragment>
      <Helmet>
        <title>Microhard &middot; Home</title>
      </Helmet>
      <Appbar />
      <Hero />
      <Functionalities />
      {/*<form onSubmit = {() => axios.post('/api/project/like/anoymous/5f74529cdafcc42aecf374fb')}>*/}
      {/*  <input type = "submit" value = "test"/>*/}
      {/*</form>*/}
    </Fragment>
  );
}
