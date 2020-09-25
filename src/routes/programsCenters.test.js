import axios from 'axios';
import { getPrograms, getCenters } from './programsCenters';

const mockRequest = {
  query: { region: 1, type: 1 },
};

const mockResponse = {
  send: jest.fn(),
};

const mockSuccessResponse = {
  data: {
    results: 1,
    documents: [{
      granteeName: 'Community Concepts, Inc',
      grantNumber: '01CH011183',
      grantType: 1,
    }],
  },
};

jest.mock('axios');

describe('ecklc api', () => {
  beforeEach(async () => {
    axios.get.mockReset();
  });

  it('returns no program data on error', async () => {
    axios.get.mockRejectedValueOnce();

    await getPrograms(mockRequest, mockResponse);

    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('returns no center data on error', async () => {
    axios.get.mockRejectedValueOnce();

    await getCenters(mockRequest, mockResponse);

    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it('returns program data in a normal flow', async () => {
    axios.get.mockResolvedValueOnce(mockSuccessResponse);

    await getPrograms(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('returns center data in a normal flow', async () => {
    axios.get.mockResolvedValueOnce(mockSuccessResponse);

    await getCenters(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalled();
  });
});
