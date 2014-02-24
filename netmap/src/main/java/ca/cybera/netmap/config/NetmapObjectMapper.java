package ca.cybera.netmap.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class NetmapObjectMapper extends ObjectMapper {

	
	public NetmapObjectMapper() {
		super();
		setSerializationInclusion(JsonInclude.Include.NON_NULL); // no more null-valued properties
		configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}
}
