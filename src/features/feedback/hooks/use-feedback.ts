"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedbacks } from "../server/get-feedbacks";
import { submitFeedback, FeedbackData } from "../server/submit-feedback";
import { checkUserFeedback } from "../server/check-user-feedback";
import { toast } from "sonner";

export function useFeedbacks() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const data = await getFeedbacks();
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FeedbackData) => {
      const result = await submitFeedback(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Feedback enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["user-feedback"] });
    },
    onError: () => {
      toast.error("Erro ao enviar feedback. Tente novamente.");
    },
  });
}

export function useCheckUserFeedback() {
  return useQuery({
    queryKey: ["user-feedback"],
    queryFn: async () => {
      const result = await checkUserFeedback();
      return result.hasFeedback;
    },
  });
}
