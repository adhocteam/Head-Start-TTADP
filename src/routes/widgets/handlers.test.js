import { getWidget } from './handlers';

const mockResponse = {
  json: jest.fn(),
  sendStatus: jest.fn(),
  status: jest.fn(() => ({
    end: jest.fn(),
  })),
};

const mockRequest = {
  session: {
    userId: 1,
  },
  params: { widgetId: 'overview' },
};

describe('Widget handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWidget', () => {
    const request = {
      ...mockRequest,
      query: { 'region.in': ['1'] },
    };

    it('returns overview data', async () => {
      const response = {
        numGrants: '0', numParticipants: '0', numReports: '0', numTotalGrants: '2', sumDuration: '0', sumTaDuration: '0', sumTrainingDuration: '0',
      };
      await getWidget(request, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it('handles no region in query', async () => {
      const response = {
        numGrants: '0', numParticipants: '0', numReports: '0', numTotalGrants: '2', sumDuration: '0', sumTaDuration: '0', sumTrainingDuration: '0',
      };
      await getWidget({ ...mockRequest, query: {} }, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it('returns 404 when unknown widget', async () => {
      await getWidget({ ...request, params: { widgetId: 'nonexistent' } }, mockResponse);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });
  });
});
