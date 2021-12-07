
export class Aarticle {
    constructor(id_article, id_assy, title, short_description, long_description, meta_description, meta_category, status
        , directional_light_color, directional_light_intensity, directional_light_px, directional_light_py, directional_light_pz
        , ambient_light_color, ambient_light_intensity, gammaOutput, id_attachment_for_eye_catch) {

        this.id_article = id_article;
        this.id_assy = id_assy;

        this.title = title;
        this.short_description = short_description;
        this.long_description = long_description;
        this.meta_description = meta_description;
        this.meta_category = meta_category;

        this.status = status;

        this.directional_light_color = directional_light_color;
        this.directional_light_intensity = directional_light_intensity;
        this.directional_light_px = directional_light_px;
        this.directional_light_py = directional_light_py;
        this.directional_light_pz = directional_light_pz;

        this.ambient_light_color = ambient_light_color;
        this.ambient_light_intensity = ambient_light_intensity;
        this.gammaOutput = gammaOutput;

        this.id_attachment_for_eye_catch = id_attachment_for_eye_catch
    }
}