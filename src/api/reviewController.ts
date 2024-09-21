// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** doAppReview POST /api/review/ */
export async function doAppReviewUsingPost(
  body: API.ReviewRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/review/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
