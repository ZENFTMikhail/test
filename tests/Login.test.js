import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../src/components/Signin';

test('Успешный вход в систему', async () => {
  const setLogin = jest.fn(); 

  render(
    <MemoryRouter>
      <SignIn setLogin={setLogin} />
    </MemoryRouter>
  );

  
  fireEvent.change(screen.getByLabelText(/Enter email/i), { target: { value: 'aleksei@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'lkJlkn8hj' } });
  fireEvent.click(screen.getByText(/Submit/i));


  await waitFor(() => {
    expect(setLogin).toHaveBeenCalledWith(true);
  });
});
