import React from 'react';

import { PageCard } from 'jeffdude-frontend-helpers';


function NotFound() {
  return (
    <div className="page">
      <PageCard>
        <h1>
          404 Page Not Found
        </h1>
        <a href="/">Go back to home</a>
      </PageCard>
    </div>
  )
}

export default NotFound;
