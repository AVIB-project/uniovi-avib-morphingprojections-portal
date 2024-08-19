export class Context {
    private _user: any;
    private _organizationId: string;
    private _projectId: String | null;
    private _caseId: String | null;
    private _bucketDataMatrix: String | null;
    private _fileDataMatrix: String | null;
    private _bucketSampleAnnotation: String | null;
    private _fileSampleAnnotation: String | null;
    private _bucketAttributeAnnotation: String | null;
    private _fileAttributeAnnotation: String | null;
    private _bucketSampleProjection: String | null;
    private _fileSampleProjection: String | null;
    private _bucketAttributeProjection: String | null;
    private _fileAttributeProjection: String | null;
    
    public get user() {
        return this._user;
    }

    public set user(value: any) {
        this._user = value;
    }    

    public get organizationId() {
        return this._organizationId;
    }

    public set organizationId(value: string) {
        this._organizationId = value;
    }
    
    public get projectId() {
        return this._projectId;
    }

    public set projectId(value: String | null) {
        this._projectId = value;
    } 
    
    public get caseId() {
        return this._caseId;
    }

    public set caseId(value: String | null) {
        this._caseId = value;
    } 
    
    public get bucketDataMatrix() {
        return this._bucketDataMatrix;
    }

    public set bucketDataMatrix(value: String | null) {
        this._bucketDataMatrix = value;
    }
    
    public get fileDataMatrix() {
        return this._fileDataMatrix;
    }
    
    public set fileDataMatrix(value: String | null) {
        this._fileDataMatrix = value;
    }
    
    public get bucketSampleAnnotation() {
        return this._bucketSampleAnnotation;
    }
    
    public set bucketSampleAnnotation(value: String | null) {
        this._bucketSampleAnnotation = value;
    }
    
    public get fileSampleAnnotation() {
        return this._fileSampleAnnotation;
    }
    
    public set fileSampleAnnotation(value: String | null) {
        this._fileSampleAnnotation = value;
    }
    
    public get bucketAttributeAnnotation() {
        return this._bucketAttributeAnnotation;
    }

    public set bucketAttributeAnnotation(value: String | null) {
        this._bucketAttributeAnnotation = value;
    }
    
    public get fileAttributeAnnotation() {
        return this._fileAttributeAnnotation;
    }
        
    public set fileAttributeAnnotation(value: String | null) {
        this._fileAttributeAnnotation = value;
    }
    
    public get bucketSampleProjection() {
        return this._bucketSampleProjection;
    } 
    
    public set bucketSampleProjection(value: String | null) {
        this._bucketSampleProjection = value;
    } 
    
    public get bucketAttributeProjection() {
        return this._bucketAttributeProjection;
    }  
    
    public set bucketAttributeProjection(value: String | null) {
        this._bucketAttributeProjection = value;
    } 
    
    public get fileSampleProjection() {
        return this._fileSampleProjection;
    } 
    
    public set fileSampleProjection(value: String | null) {
        this._fileSampleProjection = value;
    } 
    
    public get fileAttributeProjection() {
        return this._fileAttributeProjection;
    }   
    
    public set fileAttributeProjection(value: String | null) {
        this._fileAttributeProjection = value;
    }    
}