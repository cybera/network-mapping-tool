package ca.cybera.netmap.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.vividsolutions.jts.geom.Geometry;

@XmlRootElement
@Entity
@Table(name = "organization")
public class Organization {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "UUID")
	private String UUID;

	@ManyToOne
	@JoinColumn(name = "org_type")
	private OrganizationType organizationType;

	private String website;

	@Column(name = "name")
	private String name;

	@Column(name = "french_name")
	private String frenchName;

	@Column(name = "campus")
	private String campus;

	@Column(name = "main_or_sub_campus")
	private String mainOrSubCampus;

	@Column(name = "address")
	private String address;

	@Column(name = "city")
	private String city;

	@Column(name = "province")
	private String province;

	@Column(name = "postal_code")
	private String postalCode;

	@Column(name = "phone")
	private String phone;

	@Column(name = "connected")
	private Boolean connected;

	@Column(name = "comments")
	private String comments;

	@Type(type = "org.hibernate.spatial.GeometryType")
	@Column(name = "geom")
	private Geometry geom;

	@Column(name = "member_since")
	private Date memberSince;

	@Column(name = "notes")
	private String notes;

	@Column(name = "logo_url")
	private String logoUrl;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFrenchName() {
		return frenchName;
	}

	public void setFrenchName(String frenchName) {
		this.frenchName = frenchName;
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

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Geometry getGeom() {
		return geom;
	}

	public void setGeom(Geometry geom) {
		this.geom = geom;
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

	public Boolean getConnected() {
		return connected;
	}

	public void setConnected(Boolean connected) {
		this.connected = connected;
	}

	public Date getMemberSince() {
		return memberSince;
	}

	public void setMemberSince(Date memberSince) {
		this.memberSince = memberSince;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	@Override
	public String toString() {
		return "Organization [UUID=" + UUID + ", organizationType=" + organizationType + ", website=" + website + ", name=" + name + ", frenchName=" + frenchName + ", campus=" + campus
				+ ", mainOrSubCampus=" + mainOrSubCampus + ", address=" + address + ", city=" + city + ", province=" + province + ", postalCode=" + postalCode + ", phone=" + phone + ", connected="
				+ connected + ", comments=" + comments + ", geom=" + geom + ", memberSince=" + memberSince + ", notes=" + notes + "]";
	}

}
