/**
 * Because, videos weren't showing
 */

function VideoService() {
}

VideoService.getVideoModal = function() {
    if (!VideoService.videoModal) {
        VideoService.videoModal = new Video_Modal_Widget  ("-", "");
    }
    return VideoService.videoModal;
};
