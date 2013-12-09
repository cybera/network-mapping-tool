package ca.cybera.netmap.dto;

import java.util.Date;

import ca.cybera.netmap.model.OrganizationType;
import ca.cybera.netmap.model.Website;

public class OrganizationDTO {
	private String UUID;
	private OrganizationType organizationType;
	private Website website;
	private String englishName;
	private String frenchName;
	private String campus;
	private String mainOrSubCampus;
	private String address;
	private String city;
	private String province;
	private String postalCode;
	private String phone;
	private Boolean connected;
	private String comments;
	private GeometryDTO geom;
	private Date memberSince;
	
	public String getUUID() {
		return UUID;
	}
	public void setUUID(String uUID) {
		UUID = uUID;
	}
	public OrganizationType getOrganizationType() {
		return organizationType;
	}
	public void setOrganizationType(OrganizationType organizationType) {
		this.organizationType = organizationType;
	}
	public Website getWebsite() {
		return website;
	}
	public void setWebsite(Website website) {
		this.website = website;
	}
	public String getEnglishName() {
		return englishName;
	}
	public void setEnglishName(String englishName) {
		this.englishName = englishName;
	}
	public String getFrenchName() {
		return frenchName;
	}
	public void setFrenchName(String frenchName) {
		this.frenchName = frenchName;
	}
	public String getCampus() {
		return campus;
	}
	public void setCampus(String campus) {
		this.campus = campus;
	}
	public String getMainOrSubCampus() {
		return mainOrSubCampus;
	}
	public void setMainOrSubCampus(String mainOrSubCampus) {
		this.mainOrSubCampus = mainOrSubCampus;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public Boolean getConnected() {
		return connected;
	}
	public void setConnected(Boolean connected) {
		this.connected = connected;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public GeometryDTO getGeom() {
		return geom;
	}
	public void setGeom(GeometryDTO geom) {
		this.geom = geom;
	}
	public Date getMemberSince() {
		return memberSince;
	}
	public void setMemberSince(Date memberSince) {
		this.memberSince = memberSince;
	}
	
	
}
