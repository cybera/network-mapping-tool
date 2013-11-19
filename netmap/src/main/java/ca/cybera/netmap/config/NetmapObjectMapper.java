package ca.cybera.netmap.config;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize;

public class NetmapObjectMapper extends ObjectMapper {

	
	public NetmapObjectMapper() {
		super();
		setSerializationInclusion(JsonSerialize.Inclusion.NON_NULL);
		configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}
}
