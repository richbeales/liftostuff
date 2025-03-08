import { getWorkouts } from './api';
import api from './api'; // Assuming you have imported the 'api' instance

jest.mock('./api'); // Mocking the 'api' module

describe('getWorkouts', () => {
  it('should return the response data', async () => {
    const mockResponse = { data: 'mock data' };
    api.get.mockResolvedValueOnce(mockResponse);

    const result = await getWorkouts();

    expect(api.get).toHaveBeenCalledWith('/workouts');
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle errors', async () => {
    const mockError = new Error('API error');
    api.get.mockRejectedValueOnce(mockError);

    await expect(getWorkouts()).rejects.toThrow(mockError);
  });
});