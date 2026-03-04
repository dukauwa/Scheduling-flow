import React from 'react';
import SlotPriorityBuilder from '../components/SlotPriorityBuilder';

export default function SlotPrioritiesPage({ rules, onRulesChange }) {
  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <SlotPriorityBuilder rules={rules} onRulesChange={onRulesChange} />
    </div>
  );
}
