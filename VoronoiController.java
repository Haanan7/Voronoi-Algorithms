import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/voronoi")
public class VoronoiController {
    @PostMapping("/generate")
    public List<Region> generateVoronoi(@RequestBody List<Point> points) {
        return VoronoiSweepLine.voronoiSweepLine(points);
    }
}