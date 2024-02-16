// TaskList.spec.js
import { shallowMount } from '@vue/test-utils';
import TaskList from '@/components/TaskList.vue';

describe('TaskList.vue', () => {
  it('renders tasks correctly', () => {
    const tasks = [
      { id: 11, title: 'Task 1', description: 'Description 1', dueDate: '2024-02-15', completed: false },
      { id: 12, title: 'Task 2', description: 'Description 2', dueDate: '2024-02-16', completed: true },
    ];

    const wrapper = shallowMount(TaskList, {
      propsData: { tasks },
    });

    // Your actual assertions based on how the component renders tasks
    expect(wrapper.text()).toContain('Task 1');
    expect(wrapper.text()).toContain('Task 2');
    expect(wrapper.text()).toContain('Due Date: 2024-02-15');
    expect(wrapper.text()).toContain('Completed: No');
    expect(wrapper.text()).toContain('Completed: Yes');
  });

  // Add more unit tests as needed
});
