package ca.cybera.netmap.dto;

import java.util.List;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;

public class NetworkConnectionDTO {

	private String UUID;
	private Network network;
	private ConnectionSpeed connectionSpeed;
	private List<WebsiteDTO> websites;
	private String orgStartUUID;
	private String orgEndUUID;
	private GeometryDTO geom;

	public String getUUID() {
		return UUID;
	}

	public void setUUID(String uUID) {
		UUID = uUID;
	}

	public Network getNetwork() {
		return network;
	}

	public void setNetwork(Network network) {
		this.network = network;
	}

	public ConnectionSpeed getConnectionSpeed() {
		return connectionSpeed;
	}

	public void setConnectionSpeed(ConnectionSpeed connectionSpeed) {
		this.connectionSpeed = connectionSpeed;
	}

	public List<WebsiteDTO> getWebsites() {
		return websites;
	}

	public void setWebsites(List<WebsiteDTO> websites) {
		this.websites = websites;
	}

	public String getOrgStartUUID() {
		return orgStartUUID;
	}

	public void setOrgStartUUID(String orgStartUUID) {
		this.orgStartUUID = orgStartUUID;
	}

	public String getOrgEndUUID() {
		return orgEndUUID;
	}

	public void setOrgEndUUID(String orgEndUUID) {
		this.orgEndUUID = orgEndUUID;
	}

	public GeometryDTO getGeom() {
		return geom;
	}

	public void setGeom(GeometryDTO geom) {
		this.geom = geom;
	}

}
