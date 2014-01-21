package ca.cybera.netmap.assembler;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Component;

import ca.cybera.netmap.dto.OrganizationDTO;
import ca.cybera.netmap.model.Organization;

@Component
public class OrganizationAssembler {
	@Inject
	private GeometryAssembler geomAssembler;
	
	public Organization assemble(OrganizationDTO dto) throws Exception {
		Organization org = new Organization();
		
		org.setUUID(dto.getUUID());
		org.setAddress(dto.getAddress());
		org.setCity(dto.getCity());
		org.setProvince(dto.getProvince());
		org.setPostalCode(dto.getPostalCode());
		org.setCampus(dto.getCampus());
		org.setMainOrSubCampus(dto.getMainOrSubCampus());
		org.setComments(dto.getComments());
		org.setConnected(dto.getConnected());
		org.setName(dto.getName());
		org.setFrenchName(dto.getFrenchName());
		org.setGeom(geomAssembler.assemble(dto.getGeom()));
		org.setMemberSince(dto.getMemberSince());
		org.setOrganizationType(dto.getOrganizationType());
		org.setWebsite(dto.getWebsite());
		org.setPhone(dto.getPhone());
		org.setNotes(dto.getNotes());

		return org;
	}
	
	public OrganizationDTO getDTO(Organization org) throws Exception {
		OrganizationDTO dto = new OrganizationDTO();
		
		dto.setUUID(org.getUUID());
		dto.setAddress(org.getAddress());
		dto.setCity(org.getCity());
		dto.setProvince(org.getProvince());
		dto.setPostalCode(org.getPostalCode());
		dto.setCampus(org.getCampus());
		dto.setMainOrSubCampus(org.getMainOrSubCampus());
		dto.setComments(org.getComments());
		dto.setConnected(org.getConnected());
		dto.setName(org.getName());
		dto.setFrenchName(org.getFrenchName());
		dto.setGeom(geomAssembler.getDTO(org.getGeom()));
		dto.setMemberSince(org.getMemberSince());
		dto.setOrganizationType(org.getOrganizationType());
		dto.setPhone(org.getPhone());
		dto.setWebsite(org.getWebsite());
		dto.setNotes(org.getNotes());

		return dto;
	}

	public List<OrganizationDTO> getDTO(List<Organization> list) throws Exception {
		ArrayList<OrganizationDTO> ret = new ArrayList<>();
		for(Organization itm : list)
			ret.add(getDTO(itm));
		
		return ret;
	}
	
	
}
