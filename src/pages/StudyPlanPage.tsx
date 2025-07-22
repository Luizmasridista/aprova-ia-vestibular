import React from 'react';
import StudyPlanGenerator from '../components/dashboard/StudyPlanGenerator';
import { Card, CardContent } from '../components/ui/card';

const StudyPlanPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <StudyPlanGenerator />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanPage;
