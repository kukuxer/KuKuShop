package kukuxer.KuKushop.dto.Mappers;

import java.util.List;

public interface Mappable <BP,BPD>{

    List<BPD> toBasketProductDto(List<BP> basketProduct);

}
