import React from 'react';

import { useParams } from 'react-router-dom';

import { PageCard } from '../components/common.js';
import { QueryLoader } from '../modules/data.js';
import { PartsDisplayCard } from '../components/inventory-display.js';
import { LogTable } from '../components/tables/logs.js';
import { useGetPart, useGetLogsByPart } from '../modules/inventory.js';


function PartChartCard({part}) {
  return (
    <PartsDisplayCard
      parts={[part]}
      name={part.name}
      height={80}
      partInfoAndControlsOptions={{
        partViewButton: false,
        depositEnabled: true,
      }}
    />
  );
}

export default function CategoryPage() {
  const { id } = useParams();
  const partQuery = useGetPart(id);
  const logQuery = useGetLogsByPart({partId: id});
  return (
    <div className="page">
      <QueryLoader query={partQuery} propName={"part"}>
        <PartChartCard/>
      </QueryLoader>
      <PageCard>
        <h3>Update History:</h3>
        <QueryLoader query={logQuery} propName={"logs"}>
          <LogTable/>
        </QueryLoader>
      </PageCard>
    </div>
  );
}

