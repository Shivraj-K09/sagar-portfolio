import { useQuery } from "@tanstack/react-query";
import { fetchVideoDetails } from "@/app/actions";
import { PORTFOLIO_PROJECTS, VideoProject } from "@/data/videos";
import { THUMBNAIL_URLS } from "@/data/thumbnails";

// Hook to fetch all video details with caching
export function useVideoData() {
  return useQuery({
    queryKey: ["videoData"],
    queryFn: async () => {
      // Reverse the array to show latest videos first
      const reversedProjects = [...PORTFOLIO_PROJECTS].reverse();
      
      const projectsWithDetails = await Promise.all(
        reversedProjects.map(async (project) => {
          try {
            const details = await fetchVideoDetails(project.id);
            return {
              ...project,
              title: details.title || project.title,
              thumbnailUrl:
                details.thumbnails?.maxres?.url ||
                details.thumbnails?.high?.url ||
                THUMBNAIL_URLS[project.id as keyof typeof THUMBNAIL_URLS] ||
                `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
              statistics: details.statistics || { viewCount: 0, likeCount: 0 },
            };
          } catch (error) {
            console.error(`Error fetching details for ${project.id}:`, error);
            return {
              ...project,
              thumbnailUrl:
                THUMBNAIL_URLS[project.id as keyof typeof THUMBNAIL_URLS] ||
                `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
              statistics: { viewCount: 0, likeCount: 0 },
            };
          }
        })
      );

      return projectsWithDetails;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to fetch individual video details
export function useVideoDetails(videoId: string) {
  return useQuery({
    queryKey: ["videoDetails", videoId],
    queryFn: () => fetchVideoDetails(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to get video statistics
export function useVideoStats() {
  const { data: videoData, isLoading } = useVideoData();

  const stats = videoData
    ? videoData.reduce(
        (acc, project) => ({
          views: acc.views + (project.statistics?.viewCount || 0),
          likes: acc.likes + (project.statistics?.likeCount || 0),
        }),
        { views: 0, likes: 0 }
      )
    : { views: 0, likes: 0 };

  return {
    stats,
    isLoading,
    totalVideos: PORTFOLIO_PROJECTS.length,
  };
}
