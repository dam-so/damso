import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { IContainer } from 'interfaces';
import 'styles/_main.scss';

const Container: FunctionComponent<IContainer.IProps> = props => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>{props.title}</title>
    </Head>
    <div>{props.children}</div>
  </>
);

export { Container };