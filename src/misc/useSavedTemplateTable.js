// useStore.js
import { create } from 'zustand';

const useSavedTemplateTable = create((set) => ({
  data: [
    {
      id: 1,
      question: 'Sequential top 10 clients from Q2 to Q3, US Markets region, FC Mar data, Revenue Metric',
      content: 'SELECT Client, Q2, Q3, ROUND(((Q3 - Q2) / Q2) * 100, 2) as Seq_Revenue_Change FROM project_wise WHERE Region = \'US Markets\' AND ValueKind = \'FC Mar\' AND Metric = \'Revenue\' ORDER BY Seq_Revenue_Change DESC LIMIT 10;',
      training_data_type: 'sql'
    },
    {
      id: 2,
      question: 'Sequential top 10 clients from Q2 to Q3, US Markets region, FC Mar data, Revenue Metric, ...',
      content: 'SELECT Client, Q2, Q3, ROUND(((Q3 - Q2) / Q2) * 100, 2) as Seq_Revenue_Change ...',
      training_data_type: 'sql'
    }, 
    {
        id: 3,
        question: 'Sequential top 10 clients from Q2 to Q3, US Markets region, FC Mar data, Revenue Metric',
        content: 'SELECT Client, Q2, Q3, ROUND(((Q3 - Q2) / Q2) * 100, 2) as Seq_Revenue_Change FROM project_wise WHERE Region = \'US Markets\' AND ValueKind = \'FC Mar\' AND Metric = \'Revenue\' ORDER BY Seq_Revenue_Change DESC LIMIT 10;',
        training_data_type: 'sql'
      },
      {
        id: 4,
        question: 'Sequential top 10 clients from Q2 to Q3, US Markets region, FC Mar data, Revenue Metric, ...',
        content: 'SELECT Client, Q2, Q3, ROUND(((Q3 - Q2) / Q2) * 100, 2) as Seq_Revenue_Change ...',
        training_data_type: 'sql'
      }, 
    
  ],
  
  deleteItem: (id) => set((state) => ({
    data: state.data.filter(item => item.id !== id),
  })),
}));

export default useSavedTemplateTable;
