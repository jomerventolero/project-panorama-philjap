import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import UploadComponent from './UploadComponent';

jest.mock('axios'); // Mocking axios for testing

describe('UploadComponent', () => {
  beforeEach(() => {
    render(<UploadComponent userId="testUserId" />);
  });

  test('renders UploadComponent correctly', () => {
    // Check if the required elements are rendered
    expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();
  });

  test('uploads files on form submission', async () => {
    const mockResponse = {
      data: {
        filename: 'test.jpg',
        url: 'https://example.com/test.jpg',
      },
    };

    axios.post.mockResolvedValueOnce(mockResponse); // Mock the axios post method

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Project Title/i), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Description/i), {
      target: { value: 'Test Description' },
    });

    // Add an image
    const file = new File(['test file'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/Image/), { target: { files: [file] } });

    // Submit the form
    fireEvent.click(screen.getByText(/Upload/i));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3002/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    });

    // Verify the response
    expect(screen.getByText(/filename: test.jpg/i)).toBeInTheDocument();
    expect(screen.getByText(/url: https:\/\/example\.com\/test\.jpg/i)).toBeInTheDocument();
  });
});
